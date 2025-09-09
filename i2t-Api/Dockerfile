# -------------------
# Build stage (compile app)
# -------------------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY i2t-Api/*.csproj ./
RUN dotnet restore "i2t-Api.csproj"

COPY i2t-Api/. ./
RUN dotnet publish "i2t-Api.csproj" -c Release -o /app/publish

# -------------------
# Runtime stage
# -------------------
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Install runtime deps + build deps for Leptonica
RUN apt-get update && apt-get install -y --no-install-recommends \
    git autoconf automake libtool pkg-config build-essential \
    tesseract-ocr hunspell hunspell-en-us \
    && rm -rf /var/lib/apt/lists/*

# Build and install Leptonica 1.82.0
RUN git clone --branch 1.82.0 https://github.com/DanBloomberg/leptonica.git /tmp/leptonica \
    && cd /tmp/leptonica \
    && ./autogen.sh \
    && ./configure \
    && make \
    && make install \
    # Copy & link into system lib path so .NET loader finds it
    && cp /usr/local/lib/liblept.so.5 /usr/lib/x86_64-linux-gnu/libleptonica-1.82.0.so \
    && ln -sf /usr/local/lib/liblept.so.5 /usr/lib/x86_64-linux-gnu/liblept.so.5 \
    && ldconfig \
    && rm -rf /tmp/leptonica

# Copy published app from build stage
COPY --from=build /app/publish ./ 

# Copy tessdata and dictionaries
COPY i2t-Api/tessdata /app/tessdata
COPY i2t-Api/Dictionaries /app/Dictionaries

# OCR environment variables
ENV TESSDATA_PREFIX=/app/tessdata

ENTRYPOINT ["dotnet", "i2t-Api.dll"]

# Debug: list contents before running app
CMD ls -l /app && echo "Starting OCR API..." && dotnet i2t-Api.dll